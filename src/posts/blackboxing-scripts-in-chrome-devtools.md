---
title: Blackboxing Scripts In Chrome DevTools
date: 2018-02-05 10:30:00
tags:
  - DevTools
  - Tips
---

Chrome DevTools has a feature called blackboxing which allows you to ignore certain scripts when debugging. When a script is blackboxed, it's hidden from the call stack pane and you don't step into it when stepping through the code. This is really useful when debugging code that uses frameworks or libraries such as Ember, React or jQuery.

<!-- excerpt -->

There are a few ways to blackbox a script:

## Blackboxing in settings

{% image "./src/posts/blackboxing-scripts-in-chrome-devtools/settings.png", "The blackboxing tab in the settings section of Chrome DevTools", "(min-width: 41.5rem) 37.5rem, 15.625rem" %}

1. In the settings section, go to the "Blackboxing" tab

2. Click "Add pattern..."

3. In the text box, enter either a script name or a regex pattern that will match scripts that you want to blackbox.

4. Click add

## Blackboxing in the editor pane of the sources section

{% image "./src/posts/blackboxing-scripts-in-chrome-devtools/editor-pane.png", "The blackboxing item in the editor pane context menu", "(min-width: 41.5rem) 37.5rem, 15.625rem" %}

1. In the sources section, open the file you want to blackbox

2. Right click in the editor pane

3. Select "Blackbox script"

## Blackboxing in the call stack pane of the sources section

{% image "./src/posts/blackboxing-scripts-in-chrome-devtools/call-stack-pane.png", "The blackboxing item in the call stack pane context menu", "(min-width: 41.5rem) 37.5rem, 15.625rem" %}

1. When paused on a breakpoint, go to the sources section

2. In the call stack pane, right click on a function from the file you want to blackbox

3. Select "Blackbox script"
