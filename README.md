# grunt-stripmq
> Mobile-first CSS fallback

Port of [jtangelder's](https://github.com/jtangelder/grunt-stripmq) that takes into account min and max values, allows for file globbing, and has a variable switch to remove all css not contained in media-queries.

## Getting Started
This plugin requires Grunt `~0.4.0`, and Node `~0.10.0`

## Grunt task
````js
    stripmq: {
        options: {
            stripBase: false, // strip css outside media queries, default is false
            min-device-pixel-ratio: 1, // default is 1
            max-device-pixel-ratio: 2, // default is 2
            minWidth: 0,               // default is 0
            maxWidth: 1024,            // default is 1024
            minHeight: 0,              // default is 0
            maxHeight: 768             // default is 768
        }
        all: {
            files: {
                'desktop.css': ['mobile-first.css']
            }
            // OR
            files: [
                { src: ['test/input/*.css'], dest: 'test/output/single.css' }
            ]
            // OR
            files: [
              {
                expand: true,
                cwd: 'test/input',
                src: ['*.css'],
                dest: 'test/output/',
                ext: '-ie.css',
              },
            ]
        }
    }
````
