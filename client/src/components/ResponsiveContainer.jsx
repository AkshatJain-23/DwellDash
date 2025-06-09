import PropTypes from 'prop-types'

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  fluid = false, 
  maxWidth = 'xl',
  padding = 'default' 
}) => {
  const containerClass = fluid ? 'container-fluid' : 'container'
  
  const paddingClasses = {
    none: '',
    sm: 'px-2 px-sm-3',
    default: 'px-3 px-sm-4 px-lg-5',
    lg: 'px-4 px-sm-5 px-lg-6'
  }
  
  const maxWidthClasses = {
    sm: 'col-12 col-sm-10 col-md-8',
    md: 'col-12 col-md-10 col-lg-8', 
    lg: 'col-12 col-lg-10 col-xl-8',
    xl: 'col-12 col-xl-10 col-xxl-8',
    full: 'col-12'
  }
  
  return (
    <div className={`${containerClass} ${paddingClasses[padding]} ${className}`}>
      <div className="row justify-content-center">
        <div className={maxWidthClasses[maxWidth]}>
          {children}
        </div>
      </div>
    </div>
  )
}

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fluid: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg'])
}

export default ResponsiveContainer 