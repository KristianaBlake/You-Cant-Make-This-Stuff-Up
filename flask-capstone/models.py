import datetime 

from peewee import *

from flask_login import UserMixin 

DATABASE = SqliteDatabase('users.sqlite')

class User(UserMixin, Model):
	name = CharField(unique=True)
	username = CharField(unique=True)
	email = CharField(unique=True) ##why not use EmailField? 
	password = CharField()

	class Meta: 
		database = DATABASE
		db_table = 'user_table'

class Story(Model):
	created_date = DateTimeField(default=datetime.datetime.now)
	submission_id = ForeignKeyField(Submissions, backref='stories')

	class Meta:
		database = DATABASE


class Submission(Model):
	title = CharField(unique=True)
	description = CharField(unique=True)
	category = CharField(unique=True)
	status = CharField(unique=True)
	anonymous = BooleanField(unique=True)
	user_id = ForeignKeyField(User, backref='submissions') #kris.submissions

	class Meta:
		database = DATABASE

def initialize():
	# connect to the database
	DATABASE.connect()
	DATABASE.create_tables([User, Story, Submission], safe=True)
	print('THE TABLES HAVE BEEN CREATED!')
	DATABASE.close()




