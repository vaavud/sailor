'use strict'

import React from 'react'

import {
  Newsfeed,
  MapHarbor,
  WindHarbor} from './modules/main/newsfeed'
import History from './modules/main/history'
import Measure from './modules/main/measure'
import Map from './modules/main/map'
import Settings from './modules/main/settings'
import Summary from './modules/main/summary'

export const routes =
  [
    { id: 'newsfeed', title: 'NewsFeed', component: Newsfeed },
    { id: 'history', title: 'History', component: History },
    { id: 'measure', title: 'Measure', component: Measure },
    { id: 'map', title: 'Map', component: Map },
    { id: 'settings', title: 'Settings', component: Settings },
    { id: 'mapHarbor', title: 'Map Harbor', component: MapHarbor },
    { id: 'windHarbor', title: 'Wind Harbor', component: WindHarbor },
    { id: 'summary', title: 'Summary', component: Summary },
  ]

export const defaultRoute = 'newsfeed'

export function renderRoute(scene, push, pop) {
  var route = routes.filter(_route => _route.id === scene.route.key)[0]
  return <route.component componentProps={scene.route.props} push={push} pop={pop} />
}
