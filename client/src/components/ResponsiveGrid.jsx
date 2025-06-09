import PropTypes from 'prop-types'

const ResponsiveGrid = ({ 
  children, 
  className = '', 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'default'
}) => {
  const gapClasses = {
    none: 'g-0',
    sm: 'g-2',
    default: 'g-3 g-md-4',
    lg: 'g-4 g-md-5'
  }
  
  const colClasses = `col-${12/cols.xs} col-sm-${12/cols.sm} col-md-${12/cols.md} col-lg-${12/cols.lg}`
  
  return (
    <div className={`row ${gapClasses[gap]} ${className}`}>
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <div key={index} className={colClasses}>
            {child}
          </div>
        )) :
        <div className={colClasses}>
          {children}
        </div>
      }
    </div>
  )
}

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  cols: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number
  }),
  gap: PropTypes.oneOf(['none', 'sm', 'default', 'lg'])
}

export default ResponsiveGrid 