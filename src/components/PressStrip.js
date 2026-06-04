import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import SectionLabel from './SectionLabel'

const PressStrip = ({ items, label }) => {
  if (!items || items.length === 0) return null

  const validItems = items.filter(
    (item) => !!item && !!item.frontmatter && item.frontmatter.published !== false,
  )
  if (validItems.length === 0) return null

  return (
    <section className="sec-press-strip">
      <div className="press-inner">
        {label && <SectionLabel>{label}</SectionLabel>}
        <ul className="press-grid">
          {validItems.map((item, i) => {
            const { publication, headline, url, date, logo } = item.frontmatter
            return (
              <li key={i} className="press-item">
                <a href={url} target="_blank" rel="noopener" aria-label={`${headline} — ${publication}`}>
                  {logo && logo.src && logo.src.publicURL && (
                    <img
                      src={logo.src.publicURL}
                      alt={logo.alt || publication}
                      className="press-logo"
                    />
                  )}
                  {!logo && publication && (
                    <span className="press-pub">{publication}</span>
                  )}
                  {logo && publication && (
                    <span className="press-pub">{publication}</span>
                  )}
                  <span className="press-headline">{headline}</span>
                  {date && (
                    <span className="press-date">
                      {moment(date).format('MMMM YYYY')}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

PressStrip.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      frontmatter: PropTypes.shape({
        publication: PropTypes.string,
        headline: PropTypes.string,
        url: PropTypes.string,
        date: PropTypes.string,
        published: PropTypes.bool,
        logo: PropTypes.shape({
          src: PropTypes.shape({ publicURL: PropTypes.string }),
          alt: PropTypes.string,
        }),
      }),
    }),
  ),
  label: PropTypes.string,
}

export default PressStrip
