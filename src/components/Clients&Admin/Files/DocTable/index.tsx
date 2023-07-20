import { DocTableContent } from "./DocTableContent";
import { DocTableCount } from "./DocTableCount";
import { DocTableData } from "./DocTableData";
import { DocTableDatas } from "./DocTableDatas";
import { DocTableFile } from "./DocTableFile";
import { DocTableFileActions } from "./DocTableFileActions";
import { DocTableFileCheckbox } from "./DocTableFileCheckbox";
import { DocTableFiles } from "./DocTableFiles";
import { DocTableFilter } from "./DocTableFilter";
import { DocTableFilters } from "./DocTableFilters";
import { DocTableFooter } from "./DocTableFooter";
import { DocTableGlobalAction } from "./DocTableGlobalAction";
import { DocTableGlobalActions } from "./DocTableGlobalActions";
import { DocTableGlobalCheckbox } from "./DocTableGlobalCheckbox";
import { DocTableHeader } from "./DocTableHeader";
import { DocTableHeading } from "./DocTableHeading";
import { DocTableIcon } from "./DocTableIcon";
import { DocTableLabel } from "./DocTableLabel";
import { DocTableMessage } from "./DocTableMessage";
import { DocTableOptions } from "./DocTableOptions";
import { DocTableOptionsItem } from "./DocTableOptionsItem";
import { DocTableOptionsItemIcon } from "./DocTableOptionsItemIcon";
import { DocTableOptionsItemLabel } from "./DocTableOptionsItemLabel";
import { DocTableRoot } from "./DocTableRoot";
import { DocTableSearch } from "./DocTableSearch";
import { DocTableText } from "./DocTableText";
import { DocTableViewed } from "./DocTableViewed";

const DocTable = {
    Root: DocTableRoot,
    Header: DocTableHeader,
    Count: DocTableCount,
    Search: DocTableSearch,
    GlobalActions: DocTableGlobalActions,
    GlobalAction: DocTableGlobalAction,
    Content: DocTableContent,
    Heading: DocTableHeading,
    GlobalCheckbox: DocTableGlobalCheckbox,
    Filters: DocTableFilters,
    Filter: DocTableFilter,
    Files: DocTableFiles,
    File: DocTableFile,
    FileCheckbox: DocTableFileCheckbox,
    Datas: DocTableDatas,
    Data: DocTableData,
    Icon: DocTableIcon,
    Text: DocTableText,
    Label: DocTableLabel,
    Viewed: DocTableViewed,
    FileActions: DocTableFileActions,
    Message: DocTableMessage,
    Options: DocTableOptions,
    OptionsItem: DocTableOptionsItem,
    OptionsItemIcon: DocTableOptionsItemIcon,
    OptionsItemLabel: DocTableOptionsItemLabel,
    Footer: DocTableFooter
}

export default DocTable;