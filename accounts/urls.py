from django.urls import path 
from django.contrib.auth import views as auth_views
from . import views
from django.conf.urls import url



urlpatterns = [
    path('signup',views.signup,name='signup'),
    path('login', auth_views.LoginView.as_view(template_name='accounts/login.html'), name='login'),
    path('logout', auth_views.LogoutView.as_view(template_name='home/Base.html'), name='logout'),
    path('activate/<slug:uidb64>/<slug:token>/',views.activate_account, name='activate')
]
