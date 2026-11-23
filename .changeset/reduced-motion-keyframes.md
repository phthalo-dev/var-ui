---
'@var-ui/core': minor
---

New `reducedMotionKeyframes(stops)`: the fade-only twin of a set of keyframe stops (drops `transform`, `translate`, `rotate`, `scale` and motion-path properties). `atReducedMotion`'s docs, and the Plain CSS guide, now explain why it can't override a property an animation is driving: animated values beat normal declarations. Swap `animationName` to the twin inside `atReducedMotion` instead.
