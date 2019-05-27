import React from 'react'
import { Helmet } from 'react-helmet'

export default class PwaIcons extends React.Component {
  render() {
    let { realm, color, multitenant, appName } = this.props

    if (multitenant) {
      if (!realm) {
        realm = 'incentiveme'
      }
    } else {
      realm = 'app'
    }

    return (
      <Helmet>
        <title>{appName}</title>

        <link rel="apple-touch-icon" sizes="57x57" href={`${process.env.PUBLIC_URL}/pwa/${realm}/apple-icon-57x57.png`} />
        <link rel="apple-touch-icon" sizes="60x60" href={`${process.env.PUBLIC_URL}/pwa/${realm}/apple-icon-60x60.png`} />
        <link rel="apple-touch-icon" sizes="72x72" href={`${process.env.PUBLIC_URL}/pwa/${realm}/apple-icon-72x72.png`} />
        <link rel="apple-touch-icon" sizes="76x76" href={`${process.env.PUBLIC_URL}/pwa/${realm}/apple-icon-76x76.png`} />
        <link rel="apple-touch-icon" sizes="114x114" href={`${process.env.PUBLIC_URL}/pwa/${realm}/apple-icon-114x114.png`} />
        <link rel="apple-touch-icon" sizes="120x120" href={`${process.env.PUBLIC_URL}/pwa/${realm}/apple-icon-120x120.png`} />
        <link rel="apple-touch-icon" sizes="144x144" href={`${process.env.PUBLIC_URL}/pwa/${realm}/apple-icon-144x144.png`} />
        <link rel="apple-touch-icon" sizes="152x152" href={`${process.env.PUBLIC_URL}/pwa/${realm}/apple-icon-152x152.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${process.env.PUBLIC_URL}/pwa/${realm}/apple-icon-180x180.png`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`${process.env.PUBLIC_URL}/pwa/${realm}/android-icon-192x192.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${process.env.PUBLIC_URL}/pwa/${realm}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="96x96" href={`${process.env.PUBLIC_URL}/pwa/${realm}/favicon-96x96.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${process.env.PUBLIC_URL}/pwa/${realm}/favicon-16x16.png`} />
        <link rel="manifest" href={`${process.env.PUBLIC_URL}/pwa/${realm}/manifest.json`} />
        <meta name="theme-color" content={color} />
      </Helmet>
    )
  }
}
