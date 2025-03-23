# register

{
'API': '/api/auth/register',
'Method': 'POST',
'Request': {'username': 'string', 'password': 'string', 'role': 'string'},
'Response': {'success': True, 'message': 'User registered successfully'},
'Error': {'success': False, 'message': 'User already exists'}
}

# login

{
'API': '/api/auth/login',
'Method': 'POST',
'Request': {'username': 'string', 'password': 'string'},
'Response': {
'success': True, 'token': 'string',
'user': {'id': 'integer', 'username': 'string', 'role': 'string'},
'Error': {'success': False, 'message': 'Invalid credentials'}
}

}
