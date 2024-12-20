from django.urls import path 
from django.contrib.auth import views as auth_views
from . import views



urlpatterns = [
    path('home',views.home,name='home'),
    path('profile',views.profile,name='profile'),
    path('emicalc',views.emicalc,name='emicalc'),
    path('blogs',views.blogs,name='blogs'),
    path('blog1',views.blog1,name='blog1'),
    path('blog2',views.blog2,name='blog2'),
    path('blog3',views.blog3,name='blog3'),
]