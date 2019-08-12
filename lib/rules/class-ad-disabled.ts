import { BaseRule, Options } from './base-rule';

export class ClassAdDisabled extends BaseRule {
  constructor() {
    super({
      name: 'class-ad-disabled',
      message: 'Class names should not contain `ad(s)` or `sponsor(s)` to avoid getting flagged by ad blockers.'
    })
  }

  lint = (ast: any, options: Options) =>  {
    if (Array.isArray(ast)) {
      ast.forEach((node) => {
        if (node.attrs) {
          let {attrs} = node;
          let classAttr = attrs.class || [];
          classAttr = classAttr[0] || {};
          let classNames = (classAttr.content || '').split(' ');
          classNames.forEach((className: string) => {
            if (
              /(^|[-_])(ad?|sponsors?)([-_]|$)/i.test(className)
            ) {
              this.violation(classAttr, options);
            }
          });
        }
  
        if (node.content) {
          this.lint(node.content, options);
        }
      });
    }

    return ast;
  }
}