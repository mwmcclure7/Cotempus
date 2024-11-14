from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSettingsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_change_password(self):
        url = reverse('change-password')
        data = {
            'current_password': 'testpass123',
            'new_password': 'newtestpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newtestpass123'))

    def test_change_email(self):
        url = reverse('change-email')
        data = {
            'new_email': 'newemail@example.com'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'newemail@example.com')

    def test_delete_account(self):
        url = reverse('delete-account')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(User.objects.filter(email='test@example.com').exists())

    def test_change_password_invalid_current(self):
        url = reverse('change-password')
        data = {
            'current_password': 'wrongpass',
            'new_password': 'newtestpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_email_duplicate(self):
        # Create another user with the email we'll try to change to
        User.objects.create_user(
            email='existing@example.com',
            password='testpass123'
        )
        
        url = reverse('change-email')
        data = {
            'new_email': 'existing@example.com'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
