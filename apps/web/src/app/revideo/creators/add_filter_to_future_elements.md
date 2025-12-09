 filter inclusion straightforward for new developers?
Yes, very straightforward! The pattern is now established:

For any new component:

Add filters?: Array<Record<string, number>> to default props
In the animation creator, copy the 
convertFilters
 function (or import from a shared util)
Destructure filters separately: const { elementId, filters: rawFilters, ...rest } = props
Convert and apply: filters={convertFilters(rawFilters)}
Done! The UI already exists in 
SharedSettings
Example for a new shape component:

tsx
const { elementId, filters: rawFilters, ...rest } = props;
const filters = convertFilters(rawFilters);
return <Rect {...rest} filters={filters} />;
