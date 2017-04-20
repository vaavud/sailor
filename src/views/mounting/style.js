import {
  StyleSheet
} from 'react-native'

import color from '../../../assets/colorTheme'

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.vaavudBlue,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    backgroundColor: 'white',
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: color.vaavudBlue
  }
})

export default style
