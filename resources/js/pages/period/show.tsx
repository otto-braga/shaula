import PublicLayout from '@/layouts/public-layout';

// import styles
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lightgallery.scss';

import { Period } from '@/types/period';
import 'keen-slider/keen-slider.min.css';

export default function Index({ period }: { period: { data: Period } }) {
    console.log(period.data);
    return (
        <PublicLayout head={period.data.name}>
            {/* relative e object-cover para todos ficarem do mesmo tamanho. */}
            <div className="grid p-4 md:grid-cols-5 md:gap-6 md:divide-x-1 md:p-8">
                <h1>{period.data.name}</h1>
                <div></div>
            </div>
        </PublicLayout>
    );
}
