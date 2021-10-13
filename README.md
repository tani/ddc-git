# DDC source for git



https://user-images.githubusercontent.com/5019902/137079242-13f775ca-aecd-420b-8f96-69400c2a0ffd.mp4



Git managed files completion for ddc.vim
You can jump any files/branches/commits in git repository with [tani/ddc-fuzzy](https://github.com/tani/ddc-fuzzy). 

To install this source,

```viml
Plug 'tani/ddc-git'

call ddc#custom#patch_global("sources", ["git-file", "git-commit", "git-branch"])
```

Copyright (c) 2021 TANIGUCHI Masaya. All rights reserved.

This work is licensed under the MIT license.
git.io/mit-license
