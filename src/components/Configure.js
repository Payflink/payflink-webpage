import React, { useState } from 'react'
import Slider from 'rc-slider'
import {
  Link,
  injectIntl,
  FormattedHTMLMessage,
  FormattedMessage,
} from 'gatsby-plugin-intl'
import { graphql, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'
import styled from 'styled-components'
import PriceTag from './PriceTag'
import {
  totalProPrice,
  tabletTotalPrice,
  tabletLicensePrice,
  extraLicenses,
} from './prices'
import { BackNext, Right, Button, Left, H3 } from '../styles'

const tabletRadioButton = (tabletType, setTabletType, intl) => ({
  id,
  name,
  image,
  price,
  specs,
}) => {
  return (
    <TabletBox key={id}>
      <input
        type="radio"
        name="type"
        value={id}
        id={id}
        onChange={() => setTabletType(id)}
        checked={tabletType === id}
      />
      <div>
        <p>{name}</p>
        {image && <Img fluid={image.childImageSharp.fluid} />}
        {specs && (
          <ul>
            <li>
              {intl.formatMessage({ id: 'offers.calculation.tabletSize' })}{' '}
              <b>{specs.size}</b>
            </li>
            <li>
              {intl.formatMessage({
                id: 'offers.calculation.tabletResolution',
              })}{' '}
              <b css="white-space: nowrap;">{specs.resolution}</b>
            </li>
          </ul>
        )}
        <div>
          <PriceTag css="padding: 1em 0 0;" price={price.oneYear} />
          <svg width="20" height="20" viewBox="-2 -2 20 20">
            <path
              d="M0,0L0,16L16,16L16,0Z"
              strokeWidth="2"
              strokeLinejoin="round"
              css={`
                stroke: ${p => p.theme.primary};
              `}
            />
            <path d="M2,8L6,12L16,0" strokeWidth="3" />
            <path d="M12,0L0,0L0,16L16,16L16,4" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </TabletBox>
  )
}

const TabletBox = styled.label`
  position: relative;
  transition: transform ease-in 50ms;

  input {
    display: none;
    appearance: none;
    position: absolute;
    height: 100%;
    width: 100%;
    cursor: pointer;
  }

  > div {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid ${p => p.theme.primary};
    border-radius: 4px;
    padding: 1em;
    transition: background-color 200ms, color 200ms;

    p {
      margin-top: 0;
    }
    img {
      cursor: pointer;
    }
    ul {
      padding-left: 1em;
      font-size: 0.8em;
    }
    div {
      display: flex;
      justify-content: space-between;
      font-size: 0.6em;
      margin-top: auto;
      transition: color 200ms;
    }
  }

  svg {
    align-self: flex-end;
    fill: transparent;
    stroke: transparent;
  }

  &:hover {
    transform: translateY(-9px);
  }

  input:checked + div {
    background-color: ${p => p.theme.primary};
    color: white;

    svg {
      stroke: currentColor;
    }

    p {
      color: white !important;
    }
  }
`

const PriceItem = ({ tabletCount, price, id, className }) => (
  <div className={className} css="font-size: 0.7em;">
    <PriceLabel>
      <FormattedMessage id={id} values={{ tabletCount }} />
    </PriceLabel>
    <PriceTag css="padding: 0; text-align: right;" price={price} />
  </div>
)

const PriceLabel = styled.p`
  font-weight: bold;
  margin: 2em 0 0;
`

const query = graphql`
  {
    items: allMarkdownRemark(
      sort: { fields: frontmatter___sort, order: ASC }
      filter: { frontmatter: { type: { eq: "tablet" } } }
    ) {
      nodes {
        frontmatter {
          id
          name
          price {
            oneYear
            twoYears
          }
          specs {
            size
            resolution
          }
          image {
            childImageSharp {
              fluid(maxWidth: 400) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`

export default injectIntl(({ intl }) => {
  const models = useStaticQuery(query).items.nodes.map(
    ({ frontmatter }) => frontmatter
  )

  const noTablet = {
    id: 'none',
    name: intl.formatMessage({ id: 'offers.calculation.ownTablets' }),
    image: undefined,
    price: { oneYear: 0, twoYears: 0 },
    specs: undefined,
  }
  const tablets = [noTablet, ...models]

  const [tabletCount, setTabletCount] = useState(10)
  const [tabletType, setTabletType] = useState('none')

  const tabletRadioButtonWithState = tabletRadioButton(
    tabletType,
    setTabletType,
    intl
  )

  const maxTablets = 50

  const selectedTabletPrice = tablets.find(({ id }) => id === tabletType).price
    .oneYear

  const tabletCountChanged = count => {
    setTabletCount(count)
  }
  return (
    <>
      <h2 css="margin-top: 0">Gaston Menu</h2>
      <Row>
        <Configure>
          <H3 large css="margin-top: 0;">
            {intl.formatMessage({
              id: 'offers.calculation.howManyTablets',
            })}
          </H3>
          <Slider
            min={2}
            max={maxTablets}
            defaultValue={tabletCount}
            marks={{
              2: <div>2</div>,
              10: <div>10</div>,
              20: <div>20</div>,
              30: <div>30</div>,
              40: <div>40</div>,
              50: <div>50</div>,
            }}
            onChange={tabletCountChanged}
          />

          <H3 large css="margin-top: 4em;">
            {intl.formatMessage({ id: 'offers.calculation.whichTablet' })}
          </H3>
          <TabletGrid>{tablets.map(tabletRadioButtonWithState)}</TabletGrid>
          <div css="font-size: 0.7em;">
            <h3 css=" margin-top: 1.5em; margin-bottom:0.5em;">
              {intl.formatMessage({
                id: 'offers.calculation.termsAndConditions.title',
              })}
            </h3>
            <FormattedHTMLMessage id="offers.calculation.termsAndConditions.content" />
          </div>
        </Configure>
        <Price>
          <H3 large css="margin: 0">
            {intl.formatMessage({ id: 'offers.calculation.price' })}
          </H3>
          <PriceItem
            tabletCount="0"
            price="39"
            id="offers.calculation.proPlanWithLicenses"
          />
          <PriceItem
            tabletCount={extraLicenses(tabletCount)}
            price={tabletLicensePrice(tabletCount)}
            id="offers.calculation.totalLicensePrice"
          />

          {selectedTabletPrice !== 0 && (
            <PriceItem
              tabletCount={tabletCount}
              price={tabletTotalPrice(tabletCount, selectedTabletPrice)}
              id="offers.calculation.totalTabletPrice"
            />
          )}

          <PriceItem
            tabletCount={tabletCount}
            price={totalProPrice(tabletCount, selectedTabletPrice)}
            id="offers.calculation.totalPrice"
            css="font-size: 1em; margin-top: auto;"
          />
        </Price>
      </Row>

      <BackNext>
        <Right>
          <Link to={`/offers/gaston-menu/enrol/${tabletCount}/${tabletType}`}>
            <Button>{intl.formatMessage({ id: 'offers.continue' })}</Button>
          </Link>
        </Right>
        <Left>
          <Button onClick={() => window.history.back()}>
            {intl.formatMessage({ id: 'offers.back' })}
          </Button>
        </Left>
      </BackNext>
    </>
  )
})

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -2em;
`
const Configure = styled.div`
  flex: 1000 1 auto;
  margin: 2em;
`
const TabletGrid = styled.div`
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
`
const Price = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 13.8em;
  margin: 2em;
  border: 1px solid #eee;
  background: #eee;
  border-radius: 0.5em;
  padding: 1em;
`
