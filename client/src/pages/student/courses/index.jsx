


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { filterOptions, sortOptions } from "@/config"
import { AuthContext } from "@/context/auth-context"
import { StudentContext } from "@/context/student-context"
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/services"
import { ArrowUpDownIcon, FilterIcon } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

const StudentViewCoursesPage = () => {
    const navigate = useNavigate()
    const { studentViewCoursesList, setStudentViewCoursesList, loadingState, setLoadingState } = useContext(StudentContext);
    const { auth } = useContext(AuthContext)

    const [sort, setSort] = useState("price-lowtohigh");
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [showFilters, setShowFilters] = useState(false); // Toggle filters on small screens

    function createSearchParamsHelper(filterParams) {
        const queryParams = [];
        for (const [key, value] of Object.entries(filterParams)) {
            if (Array.isArray(value) && value.length > 0) {
                queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
            }
        }
        return queryParams.join("&");
    }

    function handleFilterOnChange(getSectionId, getCurrentOption) {
        let cpyFilters = { ...filters };
        if (!cpyFilters[getSectionId]) {
            cpyFilters[getSectionId] = [getCurrentOption.id];
        } else {
            const index = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
            index === -1 ? cpyFilters[getSectionId].push(getCurrentOption.id) : cpyFilters[getSectionId].splice(index, 1);
        }
        setFilters(cpyFilters);
        sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
    }

    async function fetchAllStudentViewCourses(filters, sort) {
        const query = new URLSearchParams({ ...filters, sortBy: sort });
        const response = await fetchStudentViewCourseListService(query);
        if (response.success) {
            setStudentViewCoursesList(response?.data);
            setLoadingState(false);
        }
    }

    async function handleCourseNavigate(getCurrentCourseId) {
        const response = await checkCoursePurchaseInfoService(getCurrentCourseId, auth?.user?._id);
        if (response?.success) {
            navigate(response?.data ? `/course-progress/${getCurrentCourseId}` : `/course/details/${getCurrentCourseId}`);
        }
    }

    useEffect(() => {
        if (filters !== null && sort !== null) fetchAllStudentViewCourses(filters, sort);
    }, [filters, sort]);

    useEffect(() => {
        setSearchParams(new URLSearchParams(createSearchParamsHelper(filters)));
    }, [filters]);

    useEffect(() => {
        setSort('price-lowtohigh');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
    }, []);

    useEffect(() => {
        setFilteredCourses(searchInput
            ? studentViewCoursesList.filter(course => course.title.toLowerCase().includes(searchInput.toLowerCase()))
            : []);
    }, [searchInput, studentViewCoursesList]);

    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">All Courses</h1>

            {/* Search Bar & Filter Toggle */}
            <div className="flex justify-center mb-6">
                <Input
                    type="search"
                    placeholder="Search Courses"
                    className="w-full sm:w-[450px] md:w-[550px]"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 md:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FilterIcon className="h-5 w-5" />
                    <span>Filters</span>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {/* Sidebar Filters (Visible on md+) */}
                <aside className={`w-full md:w-64 space-y-4 ${showFilters ? "block" : "hidden"} md:block`}>
                    {Object.keys(filterOptions).map(keyItem => (
                        <div className="p-4 border-b" key={keyItem}>
                            <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                            <div className="grid gap-2 mt-2">
                                {filterOptions[keyItem].map(option => (
                                    <Label key={option.id} className="flex font-medium items-center gap-2">
                                        <Checkbox
                                            checked={filters[keyItem]?.includes(option.id)}
                                            onCheckedChange={() => handleFilterOnChange(keyItem, option)}
                                        />
                                        {option.label}
                                    </Label>
                                ))}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Main Course List */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2 p-5">
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span className="text-[16px] font-medium">Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                                    {sortOptions.map(sortItem => (
                                        <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-sm text-black font-bold">{studentViewCoursesList.length} Results found</span>
                    </div>

                    {/* Course Grid (3 Cards in a Row on lg) */}
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                        {(searchInput && filteredCourses.length > 0 ? filteredCourses : studentViewCoursesList).map(course => (
                            <Card key={course._id} className="cursor-pointer" onClick={() => handleCourseNavigate(course._id)}>
                                <CardContent className="p-4">
                                    <img src={course?.image} className="w-full h-40 object-cover rounded-md" />
                                    <CardTitle className="text-lg mt-3">{course?.title}</CardTitle>
                                    <p className="text-sm text-gray-600">By <span className="font-bold">{course?.instructorName}</span></p>
                                    <p className="text-gray-600 mt-2 text-sm">{course?.level.toUpperCase()} LEVEL</p>
                                    <p className="font-bold text-lg">${course.pricing}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {loadingState && <Skeleton />}
                    {!loadingState && studentViewCoursesList.length === 0 && <h1 className="font-extrabold text-4xl">No Courses found!</h1>}
                </main>
            </div>
        </div>
    )
}

export default StudentViewCoursesPage
