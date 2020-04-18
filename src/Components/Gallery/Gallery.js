/* eslint-disable */
import * as R from 'ramda';

import React, {
  useEffect,
  useState
} from 'react';

import {
  Container,
  Header,
  Segment,
  Grid,
  Image,
  Card,
  Loader
} from 'semantic-ui-react';

import InfiniteScroll from 'react-infinite-scroll-component';

import { shuffleMutate } from '../../utils';
import { Api, ArtSvc } from '../../api';
import ImageModal from '../ImageModal/ImageModal';

const Gallery = () => {
  const [searchParams, setSearchParams]         = useState({});
  const [strategy, setStrategy]                 = useState('met');
  const [galleryItemIds, setGalleryItemIds]     = useState([]);
  const [galleryItems, setGalleryItems]         = useState([]);
  const [galleryItemCount, setGalleryItemCount] = useState(0);
  const [pageNum, setPageNum]                   = useState(0);
  const [imageModal, setImageModal]             = useState({
    open: false,
    galleryItem: null
  });

  const GALLERY_ITEMS_PER_FETCH = 20;

  const fetchMoreItems = () => {
    const page = pageNum + 1;

    const itemIds = galleryItemIds.slice(
      page * GALLERY_ITEMS_PER_FETCH - GALLERY_ITEMS_PER_FETCH,
      page * GALLERY_ITEMS_PER_FETCH
    );

    return ArtSvc.getItemsByIds(Api)({ strategy, itemIds })
      .then(resGalleryItems => setGalleryItems([...galleryItems, ...resGalleryItems]))
      .then(() => setPageNum(page))
      .catch(console.error);
  };

  useEffect(() => {
    ArtSvc.search(Api)({ strategy })
      .then(({ total, itemIds }) => {
        setGalleryItemCount(total);
        setGalleryItemIds(shuffleMutate(R.uniq(itemIds)));
        setPageNum(0);
      });
  }, [searchParams, strategy]);

  useEffect(() => {
    fetchMoreItems();
  }, [galleryItemIds]);

  const handleCloseModal = () => {
    setImageModal({
      open: false,
      galleryItem: null
    })
  };

  const handleOpenModal = galleryItem => {
    setImageModal({
      open: true,
      galleryItem
    })
  };

  const renderImageModal = () => {
    const { open, galleryItem } = imageModal;
    if (!open || !galleryItem) {
      return null;
    }

    return (
      <ImageModal
        onClose={handleCloseModal}
        galleryItem={galleryItem}
      />
      );
  };

  return window.localStorage.getItem('dev') ? (
    <Segment id="gallery" style={{ padding : '8em 0em' }} vertical>
      <Container>
        <Header as="h3" style={{
          textAlign : 'center',
          fontSize : '3em',
          color : 'rgba(247,218,177, 0.8)'
        }}>
          { `${strategy} Gallery`.toUpperCase() }
        </Header>
        <InfiniteScroll
          dataLength={galleryItems.length}
          next={fetchMoreItems}
          hasMore={galleryItems.length < galleryItemCount}
          loader={<Loader inverted active content='Loading' />}
          endMessage={<h5>End of this gallery</h5>}
        >
          <Grid>
            {
              galleryItems.map(({ id, title, primaryImageSmall, primaryImage }) => (
                <Grid.Column key={id} mobile={16} tablet={8} computer={4}>
                  <Card
                    onClick={() => handleOpenModal({
                      id,
                      title,
                      imageUrl: primaryImage
                    })}
                  >
                    <Image
                      src={primaryImageSmall}
                      wrapped
                      size="large"
                    />
                    <Card.Content>
                      <Card.Header>{title}</Card.Header>
                      <Card.Meta>Courtesy of MET</Card.Meta>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              ))
            }
          </Grid>
        </InfiniteScroll>

      </Container>
      { renderImageModal() }
    </Segment>
  ) : null;
};

export default Gallery;
