// Token blacklist for logout functionality
// In production, this should use Redis or a database
class TokenBlacklist {
  constructor() {
    this.blacklistedTokens = new Map();
    
    // Clean up expired tokens every hour
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 60 * 60 * 1000);
  }

  // Add token to blacklist
  addToken(token, expirationTime) {
    this.blacklistedTokens.set(token, {
      blacklistedAt: Date.now(),
      expiresAt: expirationTime
    });
  }

  // Check if token is blacklisted
  isBlacklisted(token) {
    return this.blacklistedTokens.has(token);
  }

  // Remove expired tokens from blacklist
  cleanupExpiredTokens() {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [token, data] of this.blacklistedTokens.entries()) {
      if (data.expiresAt < now) {
        this.blacklistedTokens.delete(token);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.log(`[TokenBlacklist] Cleaned up ${removedCount} expired tokens`);
    }
  }

  // Get blacklist stats
  getStats() {
    return {
      totalBlacklistedTokens: this.blacklistedTokens.size,
      oldestToken: this.blacklistedTokens.size > 0 ? 
        Math.min(...Array.from(this.blacklistedTokens.values()).map(v => v.blacklistedAt)) : null
    };
  }

  // Clear all tokens (for testing or maintenance)
  clearAll() {
    const count = this.blacklistedTokens.size;
    this.blacklistedTokens.clear();
    return count;
  }
}

// Create singleton instance
const tokenBlacklist = new TokenBlacklist();

module.exports = tokenBlacklist;