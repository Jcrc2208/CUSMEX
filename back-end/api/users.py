class User:
    def __init__(self, id, username, email, password):
        self.id = id
        self.username = username
        self.email = email
        self.password = password

class UserManager:
    def __init__(self):
        self.users = {}

    def add_user(self, user):
        self.users[user.id] = user

    def get_user(self, id):
        return self.users.get(id)

    def remove_user(self, id):
        if id in self.users:
            del self.users[id]

    def list_users(self):
        return list(self.users.values())
    