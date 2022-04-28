# ddu-source-source

ddu source source for ddu.vim

This source collects all of installed ddu sources.

Please read [help](doc/ddu-source-source.txt) for details.

## Requirements

- [denops.vim](https://github.com/vim-denops/denops.vim)
- [ddu.vim](https://github.com/Shougo/ddu.vim)

## Configuration

```vim
" Set kind default action.
call ddu#custom#patch_global({
      \ 'kindOptions': {
      \   'source': {
      \     'defaultAction': 'execute',
      \   },
      \ },
      \ })

" Use source source.
call ddu#start({'sources': [{'name': 'source'}]})
```
