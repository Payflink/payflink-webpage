import { Link } from 'gatsby'
import styled from 'styled-components'
import React from 'react'

const HeaderStyle = styled.header`
  grid-area: Header;
  display: flex;
  justify-content: space-between;

  font-weight: bold;
  height: 3.6em;
  padding: 0 0.8rem;

  @media (min-width: 600px) {
    font-size: 1.2rem;
  }

  nav {
    display: flex;
  }
  a {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 1em;
    padding-right: 1em;
    color: ${p => p.theme.text};
    text-decoration: none;
    @media (min-width: 600px) {
      padding-left: 1.2em;
      padding-right: 1.2em;
    }
  }
  .active {
    color: ${p => p.theme.primary};
  }
`
const H1 = styled.h1`
  font-size: 1rem;
  @media (min-width: 600px) {
    font-size: 1.2rem;
  }
`

const Header = () => (
  <HeaderStyle>
    <H1>
      <Link to="/" activeClassName="active">
        Gaston
      </Link>
    </H1>
    <nav>
      <Link to="purpose" activeClassName="active">
        Purpose
      </Link>
      <Link to="blog" activeClassName="active">
        Blog
      </Link>
      <Link to="contact" activeClassName="active">
        Contact
      </Link>
    </nav>
  </HeaderStyle>
)

export default Header