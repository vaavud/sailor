import {
  StyleSheet
} from 'react-native'

import {
  textStyle
} from '../../components/text'

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
  heading: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 20
  },
  description: {
    fontSize: 22,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
    marginTop: 10
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
    ...textStyle.normal,
    fontSize: 16,
    textAlign: 'center',
    color: color.vaavudBlue
  }
})

export default style
