package middleware

import (
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

type rateLimiter struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

type RateLimitStore struct {
	visitors map[string]*rateLimiter
	mu       sync.RWMutex
	rate     rate.Limit
	burst    int
}

func NewRateLimitStore(rps float64, burst int) *RateLimitStore {
	store := &RateLimitStore{
		visitors: make(map[string]*rateLimiter),
		rate:     rate.Limit(rps),
		burst:    burst,
	}

	go store.cleanupVisitors()
	return store
}

func (store *RateLimitStore) getVisitor(ip string) *rateLimiter {
	store.mu.Lock()
	defer store.mu.Unlock()

	visitor, exists := store.visitors[ip]
	if !exists {
		limiter := rate.NewLimiter(store.rate, store.burst)
		store.visitors[ip] = &rateLimiter{
			limiter:  limiter,
			lastSeen: time.Now(),
		}
		return store.visitors[ip]
	}

	visitor.lastSeen = time.Now()
	return visitor
}

func (store *RateLimitStore) cleanupVisitors() {
	for {
		time.Sleep(time.Minute)
		store.mu.Lock()
		for ip, v := range store.visitors {
			if time.Since(v.lastSeen) > 3*time.Minute {
				delete(store.visitors, ip)
			}
		}
		store.mu.Unlock()
	}
}

var (
	rateLimitStore *RateLimitStore
	once           sync.Once
)

func getRateLimitStore() *RateLimitStore {
	once.Do(func() {
		rpsStr := os.Getenv("RATE_LIMIT_RPS")
		burstStr := os.Getenv("RATE_LIMIT_BURST")

		rps := 10.0
		if rpsStr != "" {
			if parsed, err := strconv.ParseFloat(rpsStr, 64); err == nil && parsed > 0 {
				rps = parsed
			}
		}

		burst := 20
		if burstStr != "" {
			if parsed, err := strconv.Atoi(burstStr); err == nil && parsed > 0 {
				burst = parsed
			}
		}

		rateLimitStore = NewRateLimitStore(rps, burst)
	})
	return rateLimitStore
}

func RateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		store := getRateLimitStore()
		ip := c.ClientIP()

		visitor := store.getVisitor(ip)
		if !visitor.limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

