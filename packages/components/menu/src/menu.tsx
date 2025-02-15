import {forwardRef} from "@nextui-org/system";
import {ForwardedRef, ReactElement, Ref} from "react";
import {mergeClasses} from "@nextui-org/theme";

import {UseMenuProps, useMenu} from "./use-menu";
import MenuSection from "./menu-section";
import MenuItem from "./menu-item";

interface Props<T> extends UseMenuProps<T> {}

function Menu<T extends object>(props: Props<T>, ref: ForwardedRef<HTMLUListElement>) {
  const {
    Component,
    state,
    closeOnSelect,
    color,
    disableAnimation,
    hideSelectedIcon,
    hideEmptyContent,
    variant,
    onClose,
    onAction,
    topContent,
    bottomContent,
    itemClasses,
    getBaseProps,
    getListProps,
    getEmptyContentProps,
  } = useMenu<T>({...props, ref});

  const content = (
    <Component {...getListProps()}>
      {!state.collection.size && !hideEmptyContent && (
        <li>
          <div {...getEmptyContentProps()} />
        </li>
      )}
      {[...state.collection].map((item) => {
        const itemProps = {
          closeOnSelect,
          color,
          disableAnimation,
          item,
          state,
          variant,
          onClose,
          onAction,
          hideSelectedIcon,
          ...item.props,
        };

        const mergedItemClasses = mergeClasses(itemClasses, itemProps?.classNames);

        if (item.type === "section") {
          return <MenuSection key={item.key} {...itemProps} itemClasses={mergedItemClasses} />;
        }
        let menuItem = <MenuItem key={item.key} {...itemProps} classNames={mergedItemClasses} />;

        if (item.wrapper) {
          menuItem = item.wrapper(menuItem);
        }

        return menuItem;
      })}
    </Component>
  );

  return (
    <div {...getBaseProps()}>
      {topContent}
      {content}
      {bottomContent}
    </div>
  );
}

export type MenuProps<T extends object = object> = Omit<
  Props<T>,
  "hasChildItems" | "hasTitleTextChild" | "hasDescriptionTextChild"
> & {ref?: Ref<HTMLElement>};

// forwardRef doesn't support generic parameters, so cast the result to the correct type
export default forwardRef(Menu) as <T extends object>(props: MenuProps<T>) => ReactElement;

Menu.displayName = "NextUI.Menu";
