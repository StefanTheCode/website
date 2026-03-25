import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://thecodeman.net'),
  title: 'Vertical Slice Architecture - .NET 10 Project Template',
  description:
    'Download a free production-ready Vertical Slice Architecture .NET 10 project template. Minimal APIs, EF Core, PostgreSQL, DataAnnotations, Scalar - only 5 NuGet packages.',
  keywords: [
    'Vertical Slice Architecture',
    'VSA .NET',
    '.NET project template',
    'Minimal APIs',
    'Entity Framework Core',
    'Clean Architecture alternative',
    'C# project structure',
    '.NET 10',
    'PostgreSQL .NET',
    'Scalar API documentation',
  ],
  alternates: {
    canonical: 'https://thecodeman.net/vertical-slices-architecture',
  },
  openGraph: {
    title: 'Vertical Slice Architecture - .NET 10 Project Template',
    type: 'website',
    url: 'https://thecodeman.net/vertical-slices-architecture',
    description:
      'Free production-ready Vertical Slice Architecture .NET 10 template. 10 endpoints, 2 domains, Minimal APIs, zero unnecessary abstractions - only 5 NuGet packages.',
    siteName: 'TheCodeMan.net',
  },
  twitter: {
    title: 'Vertical Slice Architecture - .NET 10 Project Template',
    card: 'summary_large_image',
    site: '@TheCodeMan__',
    creator: '@TheCodeMan__',
    description:
      'Free VSA .NET 10 template: Minimal APIs, EF Core, PostgreSQL, DataAnnotations validation, Scalar docs - zero unnecessary abstractions.',
  },
}

const templateFeatures = [
  {
    title: 'Self-contained feature slices',
    description:
      'Each feature file contains its Request DTO, validation rules, handler logic, and endpoint mapping - all in one place. Add a feature? Add a file. Delete a feature? Delete a file.',
  },
  {
    title: 'Minimal APIs with route groups',
    description:
      'No controllers, no attributes - just lambdas and route groups. Clean composition under /api/newsletters and /api/subscribers with shared OpenAPI tags.',
  },
  {
    title: 'Built-in validation with DataAnnotations',
    description:
      'A single generic ValidationFilter<T> handles validation for the entire API. Add [Required], [StringLength], [EmailAddress] to any request record - done.',
  },
  {
    title: 'ProblemDetails error responses',
    description:
      'Standard RFC 9457 error format. Structured Error records with {Feature}.{Reason} codes - easy to trace, easy to handle on the client.',
  },
  {
    title: 'Only 5 NuGet packages',
    description:
      'No MediatR. No FluentValidation. No AutoMapper. No Carter. Zero unnecessary abstractions - only what .NET gives you out of the box.',
  },
  {
    title: 'EF Core 10 + PostgreSQL',
    description:
      'Code-first with typed DbContextOptions, explicit entity configuration with HasMaxLength constraints, sealed DbContext, and auto-migrations in dev.',
  },
]

const techStackItems = [
  { tech: '.NET 10', purpose: 'Latest LTS framework' },
  { tech: 'Minimal APIs', purpose: 'Lightweight, high-performance endpoints' },
  { tech: 'EF Core 10', purpose: 'ORM with code-first migrations' },
  { tech: 'PostgreSQL', purpose: 'Database provider via Npgsql' },
  { tech: 'Scalar', purpose: 'Modern API documentation (replaces Swagger)' },
  { tech: 'DataAnnotations', purpose: 'Built-in request validation' },
]

const whatYouLearnItems = [
  'How to structure a .NET 10 API using Vertical Slice Architecture',
  'How to use Minimal APIs with route groups for clean endpoint composition',
  'How to implement validation without FluentValidation using DataAnnotations + endpoint filters',
  'How to organize Commands and Queries within feature slices (lightweight CQRS)',
  'How to handle errors with structured error types and proper HTTP status codes',
  'How to build a production-ready API with only 5 NuGet packages',
]

const patternsUsed = [
  {
    pattern: 'Vertical Slice Architecture',
    detail: 'Features organized by business capability, not technical concern',
  },
  {
    pattern: 'CQRS (lightweight)',
    detail: 'Commands and Queries separated into subfolders per feature',
  },
  {
    pattern: 'Endpoint Filters',
    detail: 'Cross-cutting validation via generic IEndpointFilter',
  },
  {
    pattern: 'Immutable DTOs',
    detail: 'All request/response types are sealed records',
  },
  {
    pattern: 'RESTful API Design',
    detail: 'Correct HTTP verbs, status codes (201, 200, 204, 404, 409)',
  },
  {
    pattern: 'Projection Queries',
    detail: '.Select() projections instead of loading full entities for reads',
  },
]

const VerticalSlicesArchitecture = () => {
  return (
    <>
      <section className="ftco-about img ftco-section ftco-no-pb sponsorship-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 heading-section text-center">
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 mb-4">
                <div
                  className="d-inline-flex align-items-center"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '999px',
                    padding: '8px 16px',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      display: 'inline-block',
                      marginRight: '10px',
                    }}
                  />
                  <span className="text-white">
                    <strong>FREE</strong> production-ready project template
                  </span>
                </div>
              </div>

              <h1 className="text-white mb-4">
                Vertical Slice Architecture in .NET 10.
                <br />
                <span className="text-yellow">
                  Zero unnecessary abstractions.
                </span>
              </h1>

              <h3 className="text-white mb-4">
                VSA API template with 10 endpoints, 2 feature
                domains, and only 5 NuGet packages. No MediatR. No
                FluentValidation. No AutoMapper. Just clean .NET.
              </h3>

              <div className="d-flex justify-content-center">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(34, 197, 94, 0.12)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    color: '#bbf7d0',
                    padding: '10px 16px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  <span>🟢</span>
                  <span>17 source files · 10 endpoints · 5 NuGet packages</span>
                </div>
              </div>

             <div className="row justify-content-center" id="download-kit">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8">
                  <div className="text-center p-4"     
                  >
                    <h4 className="text-white">
                      Send me <span className='text-yellow'> FREE Template </span> now
                    </h4>
                    <div id="eomail-form-hero" dangerouslySetInnerHTML={{
                        __html: `<script async src="https://eomail4.com/form/138810fc-2805-11f1-987b-399d28f1f05e.js" data-form="138810fc-2805-11f1-987b-399d28f1f05e"></script>`
                      }} />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="background-yellow" />

        <div className="container">
          <div className="row text-center">
            <div className="col-md-12 mb-5">
              <h2 className="text-white">What&#39;s inside the template</h2>
              <p className="text-white">
                Not a toy example. A real project with two complete feature
                domains, 10 fully functional endpoints, and zero bloat.
              </p>
            </div>

            {templateFeatures.map((item, index) => (
              <div
                className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-4"
                key={index}
              >
                <div
                  className="p-4 h-100"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    textAlign: 'left',
                  }}
                >
                  <h4 className="text-white mb-3">
                    <span className="text-yellow">✓</span> {item.title}
                  </h4>
                  <p className="text-white mb-0">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="row pt-4 pb-3">
            <div className="col-md-12 text-center mb-4">
              <h2 className="text-white">What you&#39;ll learn</h2>
            </div>

            <div className="col-md-8 offset-md-2">
              <div
                className="p-4"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'left',
                }}
              >
                {whatYouLearnItems.map((item, index) => (
                  <div key={index} className="mb-3">
                    <p className="text-white mb-0">✅ {item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row pt-4 pb-5">
            <div className="col-md-6 mb-4">
              <div
                className="p-4 h-100"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'left',
                }}
              >
                <h3 className="text-white mb-3">What is this exactly?</h3>
                <p className="text-white mb-0">
                  A production-ready STARTER Vertical Slice Architecture API template
                  built with .NET 10 and Minimal APIs. Two complete feature
                  domains - Newsletters (full CRUD + Publish) and Subscribers
                  (full CRUD) - with 10 fully functional endpoints, structured
                  error handling, and modern API documentation via Scalar.
                </p>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div
                className="p-4 h-100"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  textAlign: 'left',
                }}
              >
                <h3 className="text-white mb-3">Who is it for?</h3>
                <p className="text-white mb-0">
                  .NET developers who want to move beyond the traditional
                  N-layer/Clean Architecture. Backend engineers looking for a
                  lightweight, maintainable API structure. Teams that want each
                  feature independently buildable - and anyone tired of jumping
                  between 5+ files to understand one feature.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default VerticalSlicesArchitecture
