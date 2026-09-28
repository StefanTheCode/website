import { eoFormScript } from './thirdParty';

export const MAIN_NEWSLETTER_FORM_ID = '861505f8-b3f8-11ef-896f-474a313dbc14';

/**
 * EmailOctopus inline form that doesn't slow the page down.
 * A lightweight placeholder with the same look is rendered immediately; the real
 * EmailOctopus form (and its reCAPTCHA) loads on the visitor's first interaction and
 * replaces it - see components/thirdParty.ts. Space is reserved so nothing shifts.
 */
export default function NewsletterForm({
  formId = MAIN_NEWSLETTER_FORM_ID,
  buttonText = 'Join 20k+ engineers',
  minHeight = 151,
  className,
}: {
  formId?: string;
  buttonText?: string;
  minHeight?: number;
  className?: string;
}) {
  return (
    <div data-eo-wrap className={className} style={{ minHeight }}>
      <div className="eo-placeholder">
        <div>
          <div className="form-group mb-2" style={{ marginTop: 16 }}>
            <input aria-label="Email address" type="email" placeholder="Email address" className="form-control" autoComplete="email" />
          </div>
          <button type="button" className="btn w-100 btn-primary mb-2">{buttonText}</button>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: eoFormScript(formId) }} />
    </div>
  );
}
