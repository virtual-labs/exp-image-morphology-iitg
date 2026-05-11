  ## Theory

Morphology operates on the structure of objects in a binary image using a structuring element B.

1. Erosion (A ⊖ B)
   - Shrinks foreground objects.
   - Removes small noise.
   - Reduces object boundaries.

2. Dilation (A ⊕ B)
   - Expands foreground objects.
   - Fills small gaps.

3. Opening
   - Erosion followed by dilation.
   - Removes small noise objects.

4. Closing
   - Dilation followed by erosion.
   - Fills small holes and gaps.
