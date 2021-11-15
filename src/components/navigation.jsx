export const Navigation = (props) => {
  return (
    <nav id='menu' className='navbar navbar-default'>
      <div className='container'>
        <div className='navbar-header'>
          <button
            type='button'
            className='navbar-toggle collapsed'
            data-toggle='collapse'
            data-target='#bs-example-navbar-collapse-1'
          >
            {' '}
            <span className='sr-only'>Toggle navigation</span>{' '}
            <span className='icon-bar'></span>{' '}
            <span className='icon-bar'></span>{' '}
            <span className='icon-bar'></span>{' '}
          </button>
          <a className='navbar-brand page-scroll' href='#page-top'>
            Celestial Body Shop
          </a>{' '}
        </div>

        <div
          className='collapse navbar-collapse'
          id='bs-example-navbar-collapse-1'
        >
          <ul className='nav navbar-nav navbar-right'>
            <li>
              <a href='#about' className='page-scroll'>
                About
              </a>
            </li>
            <li>
              <a href='#faq' className='page-scroll'>
                F.A.Q
              </a>
            </li>
            <li>
            <a href={'/'}>
                      <i className='fa fa-lg fa-twitter page-scroll social-button'></i>
                    </a>
            </li>
            <li>
            <a href={ '/'}>
                      <i className='fab fa-lg fa-discord page-scroll social-button'></i>
                    </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
