from django.db import models
from django.contrib.auth.models import User


class Conversation(models.Model):
    conversation_name = models.CharField(max_length=10)

    def __str__(self):
        return f'{self.conversation_name}'


class GroupMember(models.Model):
    user_member = models.ForeignKey(User, on_delete=models.CASCADE)
    conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE)

    def __str__(self):
        return f'The user {self.user_member} is participant of {self.conversation_id}'

    def get_conversation(self):
        return self.conversation_id


class Message(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE)
    message_text = models.TextField()
    sent_datetime = models.DateField()
    conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE)

    def __str__(self):
        return f'The message sent from {self.from_user} with text {self.message_text} at {self.sent_datetime} of {self.conversation_id}'


class ContactBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_in_contact = models.ManyToManyField(User, related_name='contact_of', blank=True)

    def __str__(self):
        return f'Contact book of {self.user.username}'