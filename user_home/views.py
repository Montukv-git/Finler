from django.shortcuts import render,HttpResponse
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def home(request):
    return render(request,"user_home/home.html")
    
@login_required
def profile(request):
    return render(request,"user_home/profile.html")
 
@login_required
def user_home_dashboard(request):
    
    return render(request,"user_home/user_home_dashboard.html")

def emicalc(request):
    return render(request,"user_home/emicalc.html")

def blogs(request):
    return render(request,"user_home/blogs.html")

def blog1(request):
    return render(request,"user_home/blog1.html")

def blog2(request):
    return render(request,"user_home/blog2.html")

def blog3(request):
    return render(request,"user_home/blog3.html")

