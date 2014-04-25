# grunt-stripmq
> Mobile-first CSS fallback

## Getting Started
This plugin requires Grunt `~0.4.0`, and Node `~0.10.0`

Port of [jtangelder's](https://github.com/jtangelder/grunt-stripmq) that takes into account min and max values, allows for file globbing, and has a variable switch to remove all css not contained in media-queries.

## Extra Variables

### stripBase

If true, removes all css *not* contained in media queries.  Useful if creating an IE8 stylesheet based only on styles missed in media queries.

*Note:* Right now if this is true all "print" and "only screen" only media queries are ignored from output.

### abortMaxWidth and abortMaxHeight

These variables set a mode that avoids including styles from intermediary media queries (like excluding tablet sized only stlyes).

If true, max widths/heights on processed media queries must be *greater than* the maxWidth/maxHeight variable set.

*For instance*: minWidth is set to 600 and maxWidth is set to 1024

Two media queries are encountered

> screen and (min-width: 769)

and 

> screen and (min-width: 600 and max-width: 768)

The first is accepted, printing the containing styles. The second is excluded.



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
            maxHeight: 768,            // default is 768
            abortMaxWidth: true,       // default is true
            abortMaxHeight: true       // default is true
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
