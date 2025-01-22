import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Farm2Go
        </a>
        <span className="ms-1">&copy; 2024 Digital Solutions & Innovation</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          World Food Programme
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
