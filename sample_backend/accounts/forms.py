from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, UserChangeForm

from accounts.models import CustomUser


class CustomUserRegisterForm(UserCreationForm):
    class Meta():
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2')


class CustomUserLoginForm(AuthenticationForm):
    username = forms.CharField(max_length=50)
    password = forms.CharField(widget=forms.PasswordInput)


class CustomUserChangeForm(UserChangeForm):
    class Meta():
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name')


# class SendMessageToAdmin_Form(forms.Form):
#     class Meta:
#         model = Message
#         fields = ['message']
#         widgets = {'message': forms.Textarea(attrs={'rows': 4})}
#
#
# class AnswerToMessage_Form(forms.Form):
#     class Meta:
#         model = Message
#         fields = ['receiver', 'message']
#         widgets = {'message': forms.Textarea(attrs={'rows': 3})}
#
#     def __init__(self, *args, **kwargs):
#         user = kwargs.pop('user')
#         super().__init__(*args, **kwargs)
#         self.fields['receiver'].queryset = CustomUser.objects.filter(user_type='normal')

class ChangeToAdmin_Form(forms.Form):
    user_id = forms.IntegerField(widget=forms.HiddenInput)


class DeleteAdmin_Form(forms.Form):
    admin_id = forms.IntegerField(widget=forms.HiddenInput)
