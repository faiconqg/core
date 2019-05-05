import React from 'react'
import RendererManager from './RendererManager'
import { I18n } from 'react-i18nify'

export default class Foundation extends React.Component {
  F = RendererManager.renderer
  t = (key, replacemets) =>
    I18n.t(this.prefix ? this.prefix + '.' + key : key, replacemets)
}
