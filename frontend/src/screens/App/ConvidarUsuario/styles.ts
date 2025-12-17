import { StyleSheet } from 'react-native';

const GREEN_COLOR = '#33CA7F';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 15,
    paddingBottom: 10,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    marginBottom: 20,
    color: '#000',
    fontSize: 16,
  },
  inviteButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: GREEN_COLOR,
    marginTop: 20,
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

