package database

import (
	"fmt"
	"net"
	"os"
	"strings"
	"time"

	"blog-api/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() error {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return fmt.Errorf("DATABASE_URL not set")
	}

	dsn = forceIPv4(dsn)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to Supabase DB: %w", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	if err := sqlDB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	return nil
}

func forceIPv4(dsn string) string {
	if strings.HasPrefix(dsn, "postgres://") || strings.HasPrefix(dsn, "postgresql://") {
		parts := strings.Split(dsn, "@")
		if len(parts) != 2 {
			return dsn
		}

		hostPart := strings.Split(parts[1], "/")[0]
		hostPort := strings.Split(hostPart, ":")
		if len(hostPort) < 1 {
			return dsn
		}

		host := hostPort[0]
		if net.ParseIP(host) != nil {
			return dsn
		}

		ips, err := net.LookupIP(host)
		if err != nil {
			return dsn
		}

		for _, ip := range ips {
			if ipv4 := ip.To4(); ipv4 != nil {
				hostPort[0] = ipv4.String()
				newHostPart := strings.Join(hostPort, ":")
				if len(strings.Split(parts[1], "/")) > 1 {
					dsn = parts[0] + "@" + newHostPart + "/" + strings.Split(parts[1], "/")[1]
				} else {
					dsn = parts[0] + "@" + newHostPart
				}
				return dsn
			}
		}
	}

	return dsn
}

func Migrate() error {
	err := DB.AutoMigrate(&models.Blog{})
	if err != nil {
		return fmt.Errorf("failed to migrate database: %w", err)
	}
	return nil
}

func CloseDB() error {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			return err
		}
		return sqlDB.Close()
	}
	return nil
}
