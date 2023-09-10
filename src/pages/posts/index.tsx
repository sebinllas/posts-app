import { PaginationControls } from '@/components/PaginationControls';
import { Post } from '@/components/Post';
import { useFetch } from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { PostResponse } from '@/types/PostResponse';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Posts = () => {
	const { page, limit, nextPage, prevPage, setLimit } = usePagination(10);
	const { data, loading, error, headers } = useFetch<PostResponse[]>(
		`${API_URL}/posts/?_expand=user&_page=${page}&_limit=${limit}`
	);
	const totalPosts = headers
		? Number(headers.get('x-total-count'))
		: Number.MAX_VALUE;

	const renderPosts = () => {
		if (loading) return <p>Loading...</p>;
		if (error) return <p>Oh no something went wrong!</p>;
		if (!data) return <p>No data</p>;
		return data.map(postResponse =>
			<Post
				key={postResponse.id}
				id={postResponse.id}
				title={postResponse.title}
				description={postResponse.body}
				writer={postResponse.user.name}
			/>
		);
	};

	return (
		<div className="flex flex-col gap-4 p-4">
			<h1 className="text-2xl font-bold">Posts</h1>
			{renderPosts()}
			<PaginationControls
				page={page}
				limit={limit}
				limits={[10, 15, 20, 25]}
				onNextPage={nextPage}
				onPrevPage={prevPage}
				onLimitChange={setLimit}
				totalPosts={totalPosts}
			/>
		</div>
	);
};

export default Posts;
