import { StyleSheet } from 'react-native';

const GREEN_COLOR = '#33CA7F';
const DARK_GREEN = '#1E8558';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREEN_COLOR,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  backButtonPlaceholder: {
    width: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 200,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 24,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputError: {
    borderColor: '#FF5252',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  labelDisabled: {
    color: '#999',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 15,
    paddingRight: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'center',
  },
  inputDisabled: {
    backgroundColor: 'transparent',
    borderColor: '#999',
    color: '#999',
    paddingRight: 15,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -15,
    padding: 5,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -15,
    padding: 5,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 10,
  },
  warningIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    marginTop: 2,
  },
  hintTextContainer: {
    flex: 1,
  },
  hint: {
    color: '#E0E0E0',
    fontSize: 12,
    marginBottom: 4,
  },
  hintListItem: {
    color: '#E0E0E0',
    fontSize: 12,
    marginLeft: 4,
  },
  errorText: {
    color: '#FF5252',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: DARK_GREEN,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

