package utils

import (
	"crypto/rand"
	"encoding/hex"
	"regexp"
	"strings"
)

func GenerateSlug(title string) string {
	slug := strings.ToLower(title)
	
	reg := regexp.MustCompile(`[^\w\s-]`)
	slug = reg.ReplaceAllString(slug, "")
	
	reg = regexp.MustCompile(`[-\s]+`)
	slug = reg.ReplaceAllString(slug, "-")
	
	slug = strings.Trim(slug, "- ")
	
	b := make([]byte, 6)
	rand.Read(b)
	suffix := hex.EncodeToString(b)
	
	return slug + "-" + suffix
}

