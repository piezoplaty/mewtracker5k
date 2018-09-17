"""mewtrackweb URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from tracker import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.index, name='index'),
    url(r'^view_controllers$', views.view_controllers, name='view_controllers'),
    url(r'^checkin$', views.checkin, name='checkin'),
    url(r'^jquery$', views.view_jquery, name='view_jquery'),
    url(r'^list_entities', views.listEntities, name='listEntities'),
    url(r'^create_entity', views.createEntity, name='createEntities'),
    url(r'^tag_entity', views.addTagToEntity, name='addTagToEntity'),
    url(r'^get_entity_by_tag', views.getEntityByTag, name='getEntityByTag'),
    url(r'^set_entity_location', views.setEntityLocation, name='setEntityLocation'),
    url(r'^set_container_entity', views.setContainerEntity, name='setContainerEntity')

]
