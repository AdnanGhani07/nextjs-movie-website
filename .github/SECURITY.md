# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions of CinePulse:

| Version | Supported          |
| ------- | ------------------ |
| `0.1.x` | :white_check_mark: |
| `< 0.1` | :x:                |

---

## Reporting a Vulnerability

The security of CinePulse and its users' personal data is of paramount importance.

If you discover a security vulnerability, **please do not disclose it publicly** by creating a public GitHub issue. Instead, please follow these steps:

1. **Email the Maintainer**: Send an email directly to the project author (or submit a private security advisory via GitHub if enabled).
2. **Provide Details**:
   - A clear description of the vulnerability.
   - Steps or proof-of-concept to reproduce the vulnerability.
   - Potential impact and suggested mitigation if known.
3. **Response Timeline**:
   - We will acknowledge receipt of your report within 48 hours.
   - We will provide an assessment and timeline for a patch within 5 business days.

---

## Security Best Practices for Contributors

- **API Keys & Secrets**:
  - Never commit `.env.local` or any production secrets (`SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `GEMINI_API_KEY`, etc.) to source control.
  - Keep `.env.local` listed in `.gitignore`.
- **Row-Level Security (RLS)**:
  - Any new Supabase tables created must have Row-Level Security explicitly enabled (`alter table ... enable row level security;`).
  - Strict policies must prevent users from accessing or modifying other users' personal records (`auth.uid() = user_id`).
- **Dependencies**:
  - Keep npm dependencies updated and monitor for vulnerabilities using `npm audit`.
