import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
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
import Styled from 'styled-components';

import { Api, ArtSvc } from '../../api';
import ImageModal from '../ImageModal/ImageModal';
import ArtCategorySelect from '../ArtCategorySelect/ArtCategorySelect';

const INITIAL_ART_STRATEGY = 'met';
const GALLERY_ITEMS_PER_FETCH = 20;

const StyleHeader = Styled(Header)`
  text-align: center;
  font-size: 3em;
  color: rgba(247,218,177, 0.8);
`;

const Gallery = () => {
  const [searchParams, setSearchParams] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [strategy, setStrategy] = useState(INITIAL_ART_STRATEGY);
  const [galleryItemIds, setGalleryItemIds] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryItemCount, setGalleryItemCount] = useState(0);
  const [pageNum, setPageNum] = useState(0);
  const [imageModal, setImageModal] = useState({
    open: false,
    galleryItem: null
  });

  const updateSearchParams = newParams => setSearchParams({ ...searchParams, ...newParams });

  const fetchMoreItems = idList => {
    const page = pageNum + 1;

    const itemIds = idList.slice(
      page * GALLERY_ITEMS_PER_FETCH - GALLERY_ITEMS_PER_FETCH,
      page * GALLERY_ITEMS_PER_FETCH
    );

    return ArtSvc.getItemsByIds(Api)({ strategy, itemIds })
      .then(resGalleryItems => setGalleryItems([...galleryItems, ...resGalleryItems]))
      .then(() => setPageNum(page))
    // eslint-disable-next-line no-console
      .catch(console.error);
  };

  useEffect(() => {
    setGalleryItems([]);
    setPageNum(0);
    ArtSvc.search(Api)({ strategy, searchParams })
      .then(({ total, itemIds }) => {
        setGalleryItemCount(total);
        setGalleryItemIds(R.uniq(itemIds));
      });
  }, [searchParams, strategy]);

  useEffect(() => {
    fetchMoreItems(galleryItemIds);
  }, [galleryItemIds]);

  const handleCloseModal = () => {
    setImageModal({
      open: false,
      galleryItem: null
    });
  };

  const handleOpenModal = galleryItem => {
    setImageModal({
      open: true,
      galleryItem
    });
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
        <StyleHeader as="h3">
          <div>
            { `${strategy} Gallery`.toUpperCase() }
          </div>
          <div>
            <ArtCategorySelect strategy={strategy} onSelect={updateSearchParams} />
          </div>
        </StyleHeader>
        <InfiniteScroll
          dataLength={galleryItems.length}
          next={fetchMoreItems}
          hasMore={galleryItems.length < galleryItemCount}
          loader={<div style={{ margin : 'auto', padding : '20px', textAlign : 'center' }}><Loader inline inverted active content="Loading" /></div>}
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
