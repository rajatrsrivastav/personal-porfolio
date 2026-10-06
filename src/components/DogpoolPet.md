# Dogpool desktop companion

The complete companion is in `DogpoolPet.tsx`, with isolated styles in
`DogpoolPet.css`. It uses no animation library or external assets.

## Root mount

This portfolio uses Vite, so its root entry is `src/main.jsx` rather than a
Next.js layout. Dogpool is imported there and rendered immediately after
`<App />`, inside the existing `<StrictMode>` wrapper. This mounts one companion
across the portfolio, blog, article, and contributions pages.

## Artwork

`DogpoolArtwork` embeds the SVG directly in the component. Edit its paths to
change the character; retain the `0 0 40 40` view box and the class names on the
awake/sleeping groups, tail, and legs so the state animations keep working.
The displayed character is 40 pixels wide inside a 40-pixel interaction shell.
No public asset path, sprite preload, or network request is required.

## Behavior

The companion follows the pointer freely with smoothed velocity, acceleration,
deceleration, turn banking, and a distance-dependent top speed of 330 pixels per
second. Its continuous articulated gait advances with distance traveled, keeping
opposing paws, torso bounce, and head bob synchronized. Facing changes use a quick
three-dimensional pivot. It starts running beyond 48 pixels and maintains a
40-pixel radius from the pointer to avoid jitter. After four seconds without
pointer movement, it circles once and curls up with floating sleep badges.
Click or keyboard activation produces a brief hop/spin and a nonrepeating random
wisecrack for 1.8 seconds. Hover/focus holds the pet in place for interaction.

Touch/coarse-pointer devices and viewports below 768 pixels render no pet.
Reduced motion uses a static sleeping pose in the bottom-right corner, without
walking, hopping, or floating badges. Position is clamped on movement and resize;
speech bubbles switch sides near viewport edges. Animation frames pause in hidden
tabs. Effects clean up all listeners, frames, and the speech timeout on unmount.
