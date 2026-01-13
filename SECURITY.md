# Security Guidelines

## Environment Variables

⚠️ **IMPORTANT**: The `.env` file contains sensitive information and should NEVER be committed to version control.

### Before pushing to GitHub:

1. **Remove or secure the current .env file** that contains real API keys
2. **Use .env.example** as a template for environment variables
3. **Add your real values** only in local .env files that are properly gitignored

### File Protection:

- `.env` files are now properly excluded from git tracking
- All common sensitive file patterns are included in `.gitignore`
- API keys, credentials, and configuration files are protected

### Best Practices:

1. **Never commit real API keys** to repositories
2. **Use environment-specific** .env files
3. **Rotate API keys regularly** if they might be compromised
4. **Use secret management** services for production environments
5. **Review git status** before committing to check for sensitive files

### If you accidentally committed sensitive data:

1. Immediately rotate/regenerate any exposed API keys
2. Use `git filter-branch` or BFG Repo-Cleaner to remove history
3. Force push to rewrite repository history
4. Notify any affected services about potential exposure