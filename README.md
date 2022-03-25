# ddu-source-source

ddu source source for ddu.vim

This source collects all of installed ddu sources.

## Requirements

- [denops.vim](https://github.com/vim-denops/denops.vim)
- [ddu.vim](https://github.com/Shoguo/ddu.vim)

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
