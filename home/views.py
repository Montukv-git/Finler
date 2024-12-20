from django.shortcuts import render,HttpResponse
from django.contrib.auth.forms import UserCreationForm

# Create your views here.
def index(request):
    return render(request,"home/Base.html")

 