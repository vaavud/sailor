
// import { NavigationExperimental } from 'react-native'

// const {
//   StateUtils: NavigationStateUtils,
// } = NavigationExperimental

// let currentTab = 'newsfeeds'

// // Next step.
// // Define what app navigation state shall be updated.
// function updateAppNavigationState(state, action) {
//   let { type } = action
//   if (type === 'BackAction' || type === 'back') {
//     type = 'pop'
//   }

//   switch (type) {
//     case 'push': {
//       // Push a route into the scenes stack.
//       try {
//         const route = action.route
//         const { tabs } = state
//         const tabKey = tabs.routes[tabs.index].key
//         const scenes = state[tabKey]
//         const nextScenes = NavigationStateUtils.push(scenes, route)

//         if (scenes !== nextScenes) {
//           return {
//             ...state,
//             [tabKey]: nextScenes,
//           }
//         }
//       }
//       catch (err) {
//         return state
//       }

//       break
//     }

//     case 'popToRoot': {

//       // Pops a route from the scenes stack.
//       const { tabs } = state
//       const tabKey = tabs.routes[tabs.index].key
//       const scenes = state[tabKey]
//       const nextScenes = NavigationStateUtils.reset(scenes, [scenes.routes[0]], 0)

//       if (scenes !== nextScenes) {
//         return {
//           ...state,
//           [tabKey]: nextScenes,
//         }
//       }
//       break
//     }
//     case 'pop': {

//       // Pops a route from the scenes stack.
//       const { tabs } = state
//       const tabKey = tabs.routes[tabs.index].key
//       const scenes = state[tabKey]
//       const nextScenes = NavigationStateUtils.pop(scenes)

//       if (scenes !== nextScenes) {
//         return {
//           ...state,
//           [tabKey]: nextScenes,
//         }
//       }
//       break
//     }
//     case 'selectTab': {

//       const tabKey = action.tabKey
//       const { tabss } = state
//       const scenes = state[tabKey]

//       console.log('currentTab', currentTab)
//       console.log('tabKey', tabKey)
//       console.log('tabss', tabss)
//       console.log('scenes', scenes)

//       currentTab = tabKey

//       const tabs = NavigationStateUtils.jumpTo(state.tabs, tabKey)
//       if (tabs !== state.tabs) {
//         return {
//           ...state,
//           tabs,
//         }
//       }
//     }
//   }
//   return state
// }