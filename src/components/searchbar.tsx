import type { Category } from "~/app/types/recipe";
import Select, { components, type GroupBase, type MultiValue, type MultiValueProps } from "react-select";

type CategoryOption = {
  value: number;
  label: string;
};


export function SearchBar({titleInput, onTitleChange, categoryOptions, selectedCategories, handleSelectedCategories}: {
    titleInput: string,
    onTitleChange: (value: string) => void
    categoryOptions: CategoryOption[],
    selectedCategories: {categoryId: number}[]
    handleSelectedCategories: (newValue: MultiValue<{ value: number; label: string; }>) => void
}) {

    const CustomMultiValue = (
        props: MultiValueProps<CategoryOption, true, GroupBase<CategoryOption>>
        ) => {
        const values = props.selectProps.value as CategoryOption[];

        if (props.index >= 3) {
            if (props.index === 3) {
            return (
                <div className="badge badge-primary">
                +{values.length - 3} more
                </div>
            );
            }

            return null;
        }

        return <components.MultiValue {...props} />;
    };




  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-96 flex border p-4">
      <legend className="fieldset-legend">Search Recipes</legend>
      <div className="">
        <label className="label">Title</label>
        <input type="text" className="input" placeholder="" value={titleInput} onChange={(e) => onTitleChange(e.target.value)}/>
      </div>

      <div className="">
        <label className="label">Category</label>
        <Select
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter((option) =>
            selectedCategories.some((cat) => cat.categoryId === option.value)
          )}
          onChange={handleSelectedCategories
          }
          components={{
            MultiValue: CustomMultiValue,
        }}
          placeholder="Select categories..."
          closeMenuOnSelect={false}
          unstyled
          classNames={{
            control: ({ isFocused }) =>
              `input input-bordered w-full min-h-12 h-auto flex flex-wrap items-center px-2 ${
                isFocused ? "input-primary" : ""
              }`,
              
            valueContainer: () => "flex flex-wrap gap-1 py-1",
            placeholder: () => "text-base-content/50",
            input: () => "text-base-content",
            menu: () =>
              "mt-1 rounded-box border border-base-300 bg-base-100 shadow-lg z-50",
            option: ({ isFocused, isSelected }) =>
              `cursor-pointer px-3 py-2 ${
                isSelected
                  ? "bg-primary text-primary-content"
                  : isFocused
                  ? "bg-base-200"
                  : ""
              }`,
            multiValue: () => "badge badge-primary gap-1",
            multiValueLabel: () => "",
            multiValueRemove: () =>
              "cursor-pointer hover:text-error-content",
          }}
        />
      </div>
    </fieldset>
  );
}