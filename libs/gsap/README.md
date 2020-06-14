# GSAP 3.0.2
...committed to the repo?

This is the "Shockingly Green" version of GreenSock. Some of the features are exclusive to this paid tier and are not able to be installed via a standard npm package. 

Using an alias in the `package.json` file, you can `import * as gsap from 'gsap'` exactly as if it were installed traditionally.

When importing a plugin, make sure to initialize it inside of the module youve imported it into, after importing and before using. Like so:

```
import { gsap, CustomEase, SteppedEase } from 'gsap'
gsap.registerPlugin( CustomEase, SteppedEase )
```