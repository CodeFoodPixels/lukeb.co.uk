---
title: Blackboxing Scripts In Chrome DevTools
date: 2018-02-05
tags:
 - devtools
 - tips
---
Chrome DevTools has a feature called blackboxing which allows you to ignore certain scripts when debugging. When a script is blackboxed, it's hidden from the call stack pane and you don't step into it when stepping through the code. This is really useful when debugging code that uses frameworks or libraries such as Ember, React or jQuery.

<!-- more -->

There are a few ways to blackbox a script:

## Blackboxing in settings

![The blackboxing tab in the settings section of Chrome DevTools](settings.png)


1. In the settings section, go to the "Blackboxing" tab

2. Click "Add pattern..."

3. In the text box, enter either a script name or a regex pattern that will match scripts that you want to blackbox.

4. Click add

## Blackboxing in the editor pane of the sources section

![The blackboxing item in the editor pane context menu](editor-pane.png)

1. In the sources section, open the file you want to blackbox

2. Right click in the editor pane

3. Select "Blackbox script"

## Blackboxing in the call stack pane of the sources section

![The blackboxing item in the call stack pane context menu](call-stack-pane.png)

1. When paused on a breakpoint, go to the sources section

2. In the call stack pane, right click on a function from the file you want to blackbox

3. Select "Blackbox script"
